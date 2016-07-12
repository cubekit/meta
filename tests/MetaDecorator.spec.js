import MetaDecorator from 'MetaDecorator'


describe('meta/MetaDecorator', () => {

    beforeEach(function() {
        this.meta = new MetaDecorator
    })

    describe('#types', function() {

        class Type1 {}
        class Type2 {}
        class Type3 {}

        function checkMetaTypes(Class, expectedTypes) {
            expect(Class.__cubekitMeta__.constructor.types).to.eql(expectedTypes)
        }

        it('must correctly decorate a class', function() {
            const { meta } = this

            @meta.types(Type1, Type2)
            class Test {}

            checkMetaTypes(Test, [Type1, Type2])
        })

        it('must merge types if called more than once', function() {
            const { meta } = this

            @meta.types(Type2)
            @meta.types(Type1)
            class Test {}

            checkMetaTypes(Test, [Type1, Type2])
        })

        it('must not change types in the parent class', function() {
            const { meta } = this

            @meta.types(Type1)
            class ParentClass {}

            @meta.types(Type2)
            class ChildClass extends ParentClass {}

            checkMetaTypes(ParentClass, [Type1])
        })

        it('must not take types from the parent class', function() {
            const { meta } = this

            @meta.types(Type1)
            class ParentClass {}

            @meta.types(Type2)
            class ChildClass extends ParentClass {}

            checkMetaTypes(ChildClass, [Type2])
        })

        it('two inherited classes must not conflict', function() {
            const { meta } = this

            @meta.singleton()
            class ParentClass {}

            @meta.types(Type2)
            class ChildClass1 extends ParentClass {}

            @meta.types(Type3)
            class ChildClass2 extends ParentClass {}

            checkMetaTypes(ParentClass, [])
            checkMetaTypes(ChildClass1, [Type2])
            checkMetaTypes(ChildClass2, [Type3])
        })
    })

    describe('#singleton', function() {
        it('must set the "useAsSingleton" meta-property to true', function() {
            const { meta } = this

            @meta.singleton()
            class TestClass {}

            expect(TestClass.__cubekitMeta__.useAsSingleton).to.equal(true)
        })
    })
})